export interface SubModuleItem {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
}

export interface SubModuleGroup {
  groupName: string;
  items: SubModuleItem[];
}

export interface ModuleNav {
  id: string;
  label: string;
  icon: string;
  groups: SubModuleGroup[];
}
