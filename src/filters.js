function getFilters(value) {
      if (value === "LARP") return ['Q', 'L'];
      else if (value === "NAGA") return ['G'];
      else if (value === "DnD") return ['N'];
      else if (value === "RPG") return ['R'];
      else if (value === "Board Games") return ['B'];
      else if (value === "Arena / Wargamming") return ['A', 'G'];
      else if (value === "Collectable Games") return ['C'];
      else if (value === "Video Games") return ['V'];
      else if (value === "Pencil Puzzles") return ['P'];
      else if (value === "Special Events & Panels") return ['D', 'S'];
      else return [];
}
export default getFilters;
