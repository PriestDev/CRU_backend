import { tripProps } from "@/app/(student)/data";

const tripcard = (props: tripProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-(--ash)/10 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="text-(--primary) bg-(--primary)/10 rounded-lg flex items-center justify-center w-12 h-12">
          {props.type === "ride" ? (
            <span className="material-symbols-outlined">electric_rickshaw</span>
          ) : props.type === "delivery" ? (
            <span className="material-symbols-outlined">inventory_2</span>
          ) : (
            <span className="material-symbols-outlined">groups</span>
          )}
        </div>
        <div>
          <h4 className="font-bold">
            {props.from} - {props.to}
          </h4>
          <p className="text-sm text-(--ash)">
            {props.date} ▪️ {props.time}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h4 className="font-bold text-xl">N{props.price}</h4>
        <p
          className={`text-xs rounded-lg p-1.5 px-2 capitalize ${props.status === "completed" ? "text-green-500 bg-green-100" : props.status === "cancelled" ? "text-red-500 bg-red-100" : "text-gray-500 bg-gray-100"}`}
        >
          {props.status}
        </p>
      </div>
    </div>
  );
};

export default tripcard;
