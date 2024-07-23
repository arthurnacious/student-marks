import { RoleName } from "../types/roles";

const permissions = {
  createUser: [RoleName.ADMIN],
  readUser: [
    RoleName.ADMIN,
    RoleName.DEPARTMENTLEADER,
    RoleName.LECTURER,
    RoleName.FINANCE,
    RoleName.STUDENT,
  ],
  updateUser: [RoleName.ADMIN],
  deleteUser: [RoleName.ADMIN],

  createDepartment: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER],
  readDepartment: [
    RoleName.ADMIN,
    RoleName.DEPARTMENTLEADER,
    RoleName.LECTURER,
    RoleName.FINANCE,
    RoleName.STUDENT,
  ],
  updateDepartment: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER],
  deleteDepartment: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER],

  createCourse: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER, RoleName.LECTURER],
  readCourse: [
    RoleName.ADMIN,
    RoleName.DEPARTMENTLEADER,
    RoleName.LECTURER,
    RoleName.STUDENT,
  ],
  updateCourse: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER, RoleName.LECTURER],
  deleteCourse: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER],

  createClass: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER, RoleName.LECTURER],
  readClass: [
    RoleName.ADMIN,
    RoleName.DEPARTMENTLEADER,
    RoleName.LECTURER,
    RoleName.STUDENT,
  ],
  updateClass: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER, RoleName.LECTURER],
  deleteClass: [RoleName.ADMIN, RoleName.DEPARTMENTLEADER],

  createPayment: [RoleName.ADMIN, RoleName.FINANCE],
  readPayment: [RoleName.ADMIN, RoleName.FINANCE],
  updatePayment: [RoleName.ADMIN, RoleName.FINANCE],
  deletePayment: [RoleName.ADMIN, RoleName.FINANCE],
};

export const hasAbilityTo = ({
  role,
  action,
}: {
  role?: RoleName;
  action: keyof typeof permissions;
}): boolean => {
  return role ? permissions[action].includes(role) : false;
};

export const canAccess = hasAbilityTo;
