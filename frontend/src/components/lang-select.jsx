import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";

export function LangSelect({ language, onSelect }) {
  return (
    <Select onValueChange={(value) => onSelect(value)}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder={language} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="python">python</SelectItem>
          <SelectItem value="javascript">javascript</SelectItem>
          <SelectItem value="java">java</SelectItem>
          <SelectItem value="cpp">c++</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
LangSelect.propTypes = {
  language: PropTypes.string,
  onSelect: PropTypes.func,
};
