type StudentMaterial = {
  id: string;
  materialId: string;
  classId: string;
  studentId: string;
};

type courseMaterial = {
  id: string;
  name: string;
  price: number;
  courseId: string;
  amount: number;
};

export interface Payment {
  amount: number;
  type: string;
  userId: string;
}

export const getTotalPaymentAmount = (
  studentId: string,
  payments?: Payment[]
): number => {
  const payment = payments?.find(({ userId }) => studentId === userId);

  return payment ? payment.amount / 100 : 0;
};

export const getMaterialSumAmount = ({
  studentId,
  studentMaterials,
  courseMaterials,
}: {
  studentId: string;
  studentMaterials?: StudentMaterial[];
  courseMaterials?: courseMaterial[];
}): number => {
  const materialOfCurrentStudent: StudentMaterial[] | undefined =
    studentMaterials?.filter((material) => studentId === material.studentId);

  const sum =
    materialOfCurrentStudent?.reduce((acc, curr) => {
      const materialCost =
        courseMaterials?.find(({ id }) => id === curr.materialId)?.price ?? 0;
      return acc + materialCost / 100;
    }, 0) ?? 0;

  return sum;
};

export const getOwingAmount = (
  paymentAmount: number,
  classPrice: number,
  materialsSumAmount: number
): number => {
  const owedAmount = classPrice + materialsSumAmount - paymentAmount;
  return owedAmount;
};
