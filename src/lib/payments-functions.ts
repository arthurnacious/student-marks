export interface Payment {
  amount: number;
  type: string;
  userId: string;
}

export const getPaymentAmount = (
  studentId: string,
  payments?: Payment[]
): number => {
  const payment = payments?.find(({ userId }) => studentId === userId);

  return payment?.amount ?? 0;
};
