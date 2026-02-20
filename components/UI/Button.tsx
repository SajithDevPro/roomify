import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
                                           variant = "primary",
                                           size = "md",
                                           fullWidth = false,
                                           className = "",
                                           children,
                                           ...rest
                                       }) => {
    const classes = [
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? "btn--full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
};

export default Button;