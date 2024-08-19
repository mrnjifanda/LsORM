export const formatDate = (date: string) => {

    const classDate = new Date(date);
    const day = String(classDate.getDate()).padStart(2, '0');
    const month = String(classDate.getMonth() + 1).padStart(2, '0');
    const year = classDate.getFullYear();
    const hours = String(classDate.getHours()).padStart(2, '0');
    const minutes = String(classDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const now = () => {

    const data = (new Date()).toString();
    return formatDate(data);
}