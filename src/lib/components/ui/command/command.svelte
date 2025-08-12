<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: CommandPrimitive.RootProps = $props();
</script>

<CommandPrimitive.Root
	bind:value
	bind:ref
	data-slot="command"
	class={cn(
		"bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex h-full w-full flex-col overflow-hidden rounded-md",
		className
	)}
	{...restProps}
/>
