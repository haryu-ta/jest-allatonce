import { GroupService } from "./groupService";
import { GroupRepository } from "../repositories/groupRepository";
import { Group } from "../type";

const createGroup = (): Group => {
  return {
    name: "Pirates",
    members: ["Kobayashi", "Mizuhara", "Suzuki", "Nakabayashi"],
  };
};

describe("test", () => {
  let repo: Partial<GroupRepository>;

  beforeEach(() => {
    repo = {
      loadGroups: jest.fn(),
      saveGroup: jest.fn(),
    };
  });


  test("正常系", () => {
    const groupData = createGroup();
    (repo.loadGroups as jest.Mock).mockReturnValue(groupData);
    const cls = new GroupService(repo as GroupRepository);
    expect(cls.getGroups()).toEqual(groupData);
  });

  test("正常系2", () => {
    const fightClubGroup = {
      name: "FightClub",
      members: ["Sasaki", "Takizawa", "Date", "Takamiya"],
    };
    const groupData = createGroup();
    (repo.loadGroups as jest.Mock).mockReturnValue([groupData,fightClubGroup]);
    const cls = new GroupService(repo as GroupRepository);
    expect(cls.getGroupByName("Pirates")).toEqual(groupData);
  });

  test("正常系3", () => {
    const fightClubGroup = {
      name: "FightClub",
      members: ["Sasaki", "Takizawa", "Date", "Takamiya"],
    };
    const groupData = createGroup();
    (repo.loadGroups as jest.Mock).mockReturnValue([groupData,fightClubGroup]);
    const cls = new GroupService(repo as GroupRepository);
    expect(cls.getGroupByName("FightClub")).toEqual(fightClubGroup);
  });

  test("正常系4", () => {
    const fightClubGroup = {
      name: "FightClub",
      members: ["Sasaki", "Takizawa", "Date", "Takamiya"],
    };
    const groupData = createGroup();
    (repo.loadGroups as jest.Mock).mockReturnValue([groupData,fightClubGroup]);
    const cls = new GroupService(repo as GroupRepository);
    expect(cls.getGroupByName("SakuraKnights")).toBeUndefined();
  });

  test("正常系4", () => {
    const groupRepo = new GroupRepository("json.json");
    const mockedFn = jest.spyOn(groupRepo,"saveGroup");
    mockedFn.mockImplementation(() => {});
    const cls = new GroupService(groupRepo);
    expect(cls.addGroup(createGroup())).toBeUndefined();
    expect(mockedFn).toHaveBeenCalledWith(createGroup());
  });


});
