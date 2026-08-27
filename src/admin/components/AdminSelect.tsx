import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export type AdminSelectOption = {
  value: string;
  label: string;
};

type AdminSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly AdminSelectOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  size?: "default" | "compact";
  "aria-label"?: string;
};

export function AdminSelect({
  id,
  value,
  onChange,
  options,
  disabled,
  placeholder = "Select",
  className,
  triggerClassName,
  size = "default",
  "aria-label": ariaLabel,
}: AdminSelectProps) {
  const compact = size === "compact";

  return (
    <div className={cn("w-full", className)}>
      <SelectPrimitive.Root
        value={value || undefined}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-label={ariaLabel}
          className={cn(
            "flex w-full items-center justify-between gap-2 border text-left outline-none ring-0 transition-colors",
            "focus-visible:border-[var(--admin-primary)] focus-visible:outline-none focus-visible:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[placeholder]:text-[var(--admin-muted)]",
            compact
              ? "min-h-0 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em]"
              : "min-h-[42px] rounded-[var(--admin-radius-lg)] border-[var(--admin-border)] bg-white px-3 py-2.5 text-sm text-[var(--admin-ink)]",
            triggerClassName,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon
              className={cn(
                "size-4 shrink-0 opacity-70",
                compact ? "text-current" : "text-[var(--admin-muted)]",
              )}
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            align="start"
            sideOffset={6}
            className="z-[80] overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white text-[var(--admin-ink)] shadow-[0_12px_32px_rgba(17,17,17,0.12)]"
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-[var(--admin-muted)]">
              <ChevronUpIcon className="size-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="min-w-[var(--radix-select-trigger-width)] p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-default items-center rounded-[8px] py-2 pr-8 pl-3 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-[var(--admin-primary)] data-[highlighted]:text-white data-[state=checked]:bg-[var(--admin-primary)] data-[state=checked]:text-white"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                    <CheckIcon className="size-3.5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-[var(--admin-muted)]">
              <ChevronDownIcon className="size-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
