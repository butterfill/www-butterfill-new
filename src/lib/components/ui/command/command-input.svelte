<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import SearchIcon from "@lucide/svelte/icons/search";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div class="flex h-9 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-3" data-slot="command-input-wrapper">
	<SearchIcon class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
	<CommandPrimitive.Input
		data-slot="command-input"
		class={cn(
			"placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
	<!-- Note: focus:outline-none removes the blue focus border for this input.
	     This is intentional for the command palette input as the visual focus 
	     is provided by the dialog container styling instead. Do not re-add 
	     the outline as it creates a misplaced blue border. -->
</div>
