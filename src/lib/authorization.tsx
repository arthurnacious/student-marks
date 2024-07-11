import { RoleName } from "../types/roles";

const permissions = {
  createUser: [RoleName.ADMIN],
  readUser: [
    RoleName.ADMIN,
    RoleName.ACADEMYHEAD,
    RoleName.LECTURER,
    RoleName.FINANCE,
    RoleName.STUDENT,
  ],
  updateUser: [RoleName.ADMIN],
  deleteUser: [RoleName.ADMIN],

  createAcademy: [RoleName.ADMIN, RoleName.ACADEMYHEAD],
  readAcademy: [
    RoleName.ADMIN,
    RoleName.ACADEMYHEAD,
    RoleName.LECTURER,
    RoleName.FINANCE,
    RoleName.STUDENT,
  ],
  updateAcademy: [RoleName.ADMIN, RoleName.ACADEMYHEAD],
  deleteAcademy: [RoleName.ADMIN, RoleName.ACADEMYHEAD],

  createCourse: [RoleName.ADMIN, RoleName.ACADEMYHEAD, RoleName.LECTURER],
  readCourse: [
    RoleName.ADMIN,
    RoleName.ACADEMYHEAD,
    RoleName.LECTURER,
    RoleName.STUDENT,
  ],
  updateCourse: [RoleName.ADMIN, RoleName.ACADEMYHEAD, RoleName.LECTURER],
  deleteCourse: [RoleName.ADMIN, RoleName.ACADEMYHEAD],

  createClass: [RoleName.ADMIN, RoleName.ACADEMYHEAD, RoleName.LECTURER],
  readClass: [
    RoleName.ADMIN,
    RoleName.ACADEMYHEAD,
    RoleName.LECTURER,
    RoleName.STUDENT,
  ],
  updateClass: [RoleName.ADMIN, RoleName.ACADEMYHEAD, RoleName.LECTURER],
  deleteClass: [RoleName.ADMIN, RoleName.ACADEMYHEAD],

  createPayment: [RoleName.ADMIN, RoleName.FINANCE],
  readPayment: [RoleName.ADMIN, RoleName.FINANCE],
  updatePayment: [RoleName.ADMIN, RoleName.FINANCE],
  deletePayment: [RoleName.ADMIN, RoleName.FINANCE],
};

const hasAbilityTo = (
  role: RoleName,
  action: keyof typeof permissions
): boolean => {
  return permissions[action].includes(role);
};
