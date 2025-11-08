import { ReactNode } from "react";

interface MovieGridProps {
  children: ReactNode;
}

export const MovieGrid = ({ children }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {children}
    </div>
  );
};
