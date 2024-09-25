import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag } from "@/types/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colorOptions } from "@/constants/colorOptions";

interface TagInventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTag: (tagName: string, color: string) => void;
  onDeleteTags: (tagIds: number[]) => void;
  tags: Tag[];
}

export const TagInventoryDialog: React.FC<TagInventoryDialogProps> = ({
  isOpen,
  onClose,
  onAddTag,
  onDeleteTags,
  tags,
}) => {
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag(newTagName.trim(), selectedColor);
      setNewTagName("");
      setSelectedColor(colorOptions[0].value);
    }
  };

  const handleDeleteSelectedTags = () => {
    onDeleteTags(selectedTags);
    setSelectedTags([]);
  };

  const handleTagSelection = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tag Inventory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter new tag name"
              className="flex-grow"
            />
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTag}>Add Tag</Button>
          </div>
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagSelection(tag.id)}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
              </div>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <Button onClick={handleDeleteSelectedTags} variant="destructive">
              Delete Selected Tags
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
