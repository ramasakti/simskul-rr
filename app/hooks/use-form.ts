import { useState } from "react";

export function useForm<T>(initialData: T) {
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    function setField<K extends keyof T>(key: K, value: T[K]) {
        setData(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    function reset() {
        setData(initialData);
        setErrors({});
    }

    return {
        data,
        setData: setField,
        errors,
        setErrors,
        processing,
        setProcessing,
        reset,
    };
}