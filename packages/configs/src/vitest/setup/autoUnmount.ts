import { disableAutoUnmount, enableAutoUnmount } from "@vue/test-utils";
import { afterEach } from "vitest";

// Under `isolate: false` this module survives from the previous file with the flag still on, and
// enabling it twice throws
disableAutoUnmount();
enableAutoUnmount(afterEach);
