import { NotificationProps } from "@/app/(student)/data";

const alertcard = (props: NotificationProps) => {
  return (
    <div
      className={`flex justify-between gap-5 border-b border-(--stroke) p-4 ${props.isRead ? "bg-white" : "bg-(--primary)/10"}`}
    >
      <div className="flex gap-2">
        <div
          className={`flex justify-center items-center w-12 h-12 shrink-0 rounded-lg bg-(--primary) text-white ${
            props.type === "ride"
              ? props.isRead
                ? "bg-primary/10 text-primary"
                : "bg-primary text-white"
              : props.type === "delivery"
                ? props.isRead
                  ? "bg-gray-100 text-gray-600"
                  : "bg-gray-600 text-white"
                : props.type === "promo"
                  ? props.isRead
                    ? "bg-green-100 text-green-600"
                    : "bg-green-500 text-white"
                  : props.type === "system"
                    ? props.isRead
                      ? "bg-orange-100 text-orange-500"
                      : "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600"
          }`}
        >
          <span className="material-symbols-outlined">
            {props.type === "ride"
              ? "directions_car"
              : props.type === "delivery"
                ? "package_2"
                : props.type === "promo"
                  ? "sell"
                  : "settings"}
          </span>
        </div>
        <div>
          <p className="font-semibold truncate">{props.title}</p>
          <p className="text-(--ash) line-clamp-2">{props.message}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <p
          className={`text-sm ${props.isRead ? "text-(--ash)" : "text-(--primary)"}`}
        >
          {props.time}
        </p>
        <div
          className={`w-2 h-2 rounded-full bg-(--primary) ${props.isRead ? "hidden" : "block"}`}
        ></div>
      </div>
    </div>
  );
};

export default alertcard;
