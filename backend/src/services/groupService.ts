import { GroupRepository } from "../repositories/groupRepository";
import { Group } from "../type";

export class GroupService {
  constructor(private repository: GroupRepository) {}

  getGroups = (): Group[] => {
    return this.repository.loadGroups();
  };

  getGroupByName = (name: string): Group | undefined => {
    const groups = this.getGroups();
    return groups.find((group) => group.name === name);
  };

  addGroup = (group: Group): void => {
    this.repository.saveGroup(group);
  };
}
