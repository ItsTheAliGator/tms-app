export const formatDate = (value: Date) => {
    return value.toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const formatCurrency = (value: number) => {
    return value.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
};
