import React from "react";
import { cn } from "../../lib/utils";

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
    return <div className={`bg-white rounded-lg shadow-md p-4 ${className || ""}`}>{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ className, children }) => {
    return <div className={`border-b pb-2 mb-2 ${className || ""}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ className, children }) => {
    return <h3 className={`text-xl font-semibold ${className || ""}`}>{children}</h3>;
};


export const CardContent: React.FC<CardProps> = ({ className, children }) => {
    return <div className={`mt-2 ${className || ""}`}>{children}</div>;
};
