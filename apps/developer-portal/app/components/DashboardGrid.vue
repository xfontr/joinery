<template>
    <div class="flex flex-col gap-4">
        <div ref="grid" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
                v-for="widget in shown"
                :key="widget.id"
                :data-widget-id="widget.id"
                :class="[SPAN_CLASSES[widget.size], editing && 'widget-wiggle']"
                class="flex min-w-0 flex-col gap-2"
                @contextmenu="swallowAfterPress"
            >
                <div
                    v-if="editing"
                    class="flex items-center gap-1 rounded-md bg-elevated px-1 py-0.5 text-xs"
                >
                    <UButton
                        data-widget-handle
                        class="cursor-grab active:cursor-grabbing"
                        icon="i-lucide-grip-vertical"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        :aria-label="$t('dashboardGrid.drag', { widget: labelFor(widget.id) })"
                    />
                    <span class="mr-auto truncate font-medium">{{ labelFor(widget.id) }}</span>
                    <UButton
                        icon="i-lucide-arrow-left"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        :aria-label="$t('dashboardGrid.earlier', { widget: labelFor(widget.id) })"
                        @click="apply(moveWidget(layout, widget.id, -1))"
                    />
                    <UButton
                        icon="i-lucide-arrow-right"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        :aria-label="$t('dashboardGrid.later', { widget: labelFor(widget.id) })"
                        @click="apply(moveWidget(layout, widget.id, 1))"
                    />
                    <UButton
                        :icon="SIZE_ICONS[widget.size]"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        :aria-label="
                            $t('dashboardGrid.resize', {
                                widget: labelFor(widget.id),
                                size: $t(`dashboardGrid.sizes.${widget.size}`),
                            })
                        "
                        @click="apply(cycleSize(layout, widget.id))"
                    />
                    <UButton
                        icon="i-lucide-x"
                        size="xs"
                        variant="ghost"
                        color="error"
                        :aria-label="$t('dashboardGrid.remove', { widget: labelFor(widget.id) })"
                        @click="apply(removeWidget(layout, widget.id))"
                    />
                </div>

                <div
                    :inert="editing"
                    class="@container flex-1 *:h-full"
                    :class="editing && 'pointer-events-none'"
                >
                    <slot :name="widget.id" />
                </div>
            </div>
        </div>

        <div
            v-if="editing"
            class="sticky bottom-4 z-10 flex flex-wrap items-center justify-center gap-2 self-center rounded-sm border border-default bg-default/90 px-3 py-2 shadow-lg backdrop-blur-sm"
        >
            <span class="hidden px-1 text-xs text-muted sm:inline">
                {{ $t("dashboardGrid.hint") }}
            </span>
            <UDropdownMenu :items="addItems" :disabled="addItems.length === 0">
                <UButton
                    :label="$t('dashboardGrid.add')"
                    icon="i-lucide-plus"
                    size="sm"
                    variant="soft"
                    :disabled="addItems.length === 0"
                />
            </UDropdownMenu>
            <UButton
                :label="$t('dashboardGrid.reset')"
                icon="i-lucide-rotate-ccw"
                size="sm"
                variant="ghost"
                color="neutral"
                @click="reset"
            />
            <UButton
                :label="$t('dashboardGrid.done')"
                icon="i-lucide-check"
                size="sm"
                @click="editing = false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onLongPress, useEventListener, useLocalStorage } from "@vueuse/core";
import { useDraggable } from "vue-draggable-plus";
import type { DropdownMenuItem } from "@nuxt/ui";
import {
    addWidget,
    cycleSize,
    defaultLayout,
    moveWidget,
    removeWidget,
    resolveLayout,
    type DashboardLayout,
    type WidgetDefinition,
    type WidgetPlacement,
    type WidgetSize,
} from "../utils/dashboardLayout.ts";

interface Props {
    widgets: readonly WidgetDefinition[];
    /** The `localStorage` key, one per dashboard. */
    storageKey: string;
    /** Widgets with nothing to show right now: skipped outside edit mode, kept in the layout. */
    empty?: string[];
}

const { widgets, storageKey, empty = [] } = defineProps<Props>();

const editing = defineModel<boolean>("editing", { default: false });

const SPAN_CLASSES = {
    small: "col-span-1",
    medium: "sm:col-span-2",
    wide: "sm:col-span-2 lg:col-span-4",
} as const satisfies Record<WidgetSize, string>;

const SIZE_ICONS = {
    small: "i-lucide-square",
    medium: "i-lucide-rectangle-horizontal",
    wide: "i-lucide-gallery-horizontal",
} as const satisfies Record<WidgetSize, string>;

const LONG_PRESS_MS = 500;
/** Further than this and the pointer is scrolling or dragging, not pressing. */
const PRESS_SLOP_PX = 8;

const { t } = useI18n();
const toast = useToast();
let warned = false;
const warnUnsaved = () => {
    if (warned) return;
    warned = true;
    toast.add({
        title: t("dashboardGrid.unsaved"),
        color: "warning",
        icon: "i-lucide-triangle-alert",
    });
};

const initialLayout = () => defaultLayout(widgets);

// The server has no saved layout, so the browser's copy is read only once hydration is done.
const layout = useLocalStorage<DashboardLayout>(() => storageKey, initialLayout(), {
    initOnMounted: true,
    writeDefaults: false,
    serializer: {
        read: (raw: string) => resolveLayout(JSON.parse(raw), widgets),
        write: (value: DashboardLayout) => JSON.stringify(value),
    },
    onError: warnUnsaved,
});

const placements = computed<WidgetPlacement[]>({
    get: () => layout.value.widgets,
    set: (next) => (layout.value = { ...layout.value, widgets: next }),
});

const shown = computed(() =>
    editing.value
        ? layout.value.widgets
        : layout.value.widgets.filter((widget) => !empty.includes(widget.id)),
);

const byId = computed(() => new Map(widgets.map((widget) => [widget.id, widget])));
const labelFor = (id: string) => byId.value.get(id)?.label ?? id;

const apply = (next: DashboardLayout) => (layout.value = next);
const reset = () => (layout.value = initialLayout());

const grid = useTemplateRef<HTMLElement>("grid");

/** The added widget lands first, which the floating bar may have scrolled out of view. */
const add = async (definition: WidgetDefinition) => {
    apply(addWidget(layout.value, definition));
    await nextTick();
    grid.value
        ?.querySelector(`[data-widget-id="${definition.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

let pressed = false;

// The press that opened edit mode ends in a click, which would otherwise follow the widget's link.
const swallowAfterPress = (event: Event) => {
    if (!pressed) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.type === "click") pressed = false;
};

onLongPress(
    grid,
    (event) => {
        const onWidget =
            event.target instanceof Element && event.target.closest("[data-widget-id]");
        if (editing.value || event.button !== 0 || !onWidget) return;

        pressed = true;
        editing.value = true;
    },
    { delay: LONG_PRESS_MS, distanceThreshold: PRESS_SLOP_PX },
);
useEventListener(grid, "click", swallowAfterPress, { capture: true });

const addItems = computed<DropdownMenuItem[]>(() =>
    layout.value.hidden.flatMap((id) => {
        const definition = byId.value.get(id);

        return definition
            ? [
                  {
                      label: definition.label,
                      icon: definition.icon,
                      onSelect: () => add(definition),
                  },
              ]
            : [];
    }),
);

// Sortable only starts a drag from the handle, which exists only while editing.
useDraggable(grid, placements, { animation: 200, handle: "[data-widget-handle]" });
</script>
