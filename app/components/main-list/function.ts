



export function handleAmountChange(inputValue: string){
    inputValue = inputValue.replace(/[^0-9.,]/g, "").replace(",", ".");

    if (inputValue === "") return "0";
    if (inputValue === ".") return "0.";

    if (inputValue.length > 1 && inputValue.startsWith("0") && !inputValue.startsWith("0.")) {
        inputValue = inputValue.slice(1);
    }

    const dotCount = (inputValue.match(/\./g) || []).length;
    if (dotCount > 1) {
        inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
    }

    const match = inputValue.match(/^(\d{0,4})(\.\d{0,4})?/);
    return match ? match[0] : "0";
};
