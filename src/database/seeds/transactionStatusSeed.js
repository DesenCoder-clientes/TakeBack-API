export const TransactionStatusSeed = [
  {
    description: "Pendente",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Aprovada",
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Aguardando",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cancelada pelo parceiro",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cancelada pelo cliente",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
