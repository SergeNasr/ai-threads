import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown, type DropdownItem } from "./dropdown";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: "UI/Dropdown",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 min-h-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const sampleItems: DropdownItem[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
];

const itemsWithDescriptions: DropdownItem[] = [
  { id: "summarize", label: "/summarize", description: "Summarize the conversation" },
  { id: "explain", label: "/explain", description: "Explain in simple terms" },
  { id: "expand", label: "/expand", description: "Go deeper on the topic" },
  { id: "tone", label: "/tone", description: "Change the tone of response" },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    onSelect: (item) => console.log("Selected:", item),
  },
};

export const WithDescriptions: Story = {
  args: {
    items: itemsWithDescriptions,
    onSelect: (item) => console.log("Selected:", item),
  },
};

export const WithSelectedIndex: Story = {
  args: {
    items: itemsWithDescriptions,
    selectedIndex: 2,
    onSelect: (item) => console.log("Selected:", item),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    onSelect: () => {},
  },
};
