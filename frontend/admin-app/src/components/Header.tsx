import React, { useState } from "react";
import { NotificationItem } from "../types";

interface HeaderProps {
  title: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  userRole: { username: string; avatarUrl: string };
  notifications: NotificationItem[];
  onClearNotification?: (id: string) => void;
}

export default function Header({
  title,
  onSearchChange,
  searchPlaceholder = "Cari pasien atau poli...",
  userRole,
  notifications,
  onClearNotification,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] z-40 bg-white/85 backdrop-blur-md border-b border-outline-variant shadow-sm flex justify-between items-center px-6 h-16 transition-all">
      {/* Title & Search bar */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <h2 className="text-xl font-bold text-primary truncate leading-tight min-w-[120px]">
          {title}
        </h2>
        <div className="h-6 w-[1px] bg-outline-variant hidden sm:block"></div>

        {/* Dynamic Search */}
        <div className="hidden md:flex relative items-center bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant w-full focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all max-w-md">
          <span
            className="material-symbols-outlined text-outline text-xl mr-2 pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            search
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="bg-transparent border-none outline-none focus:ring-0 w-full text-sm text-on-surface placeholder:text-outline/70 p-0"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                onSearchChange("");
              }}
              className="text-outline hover:text-primary transition-colors text-xs p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Bar Actions */}
      <div className="flex items-center gap-4">
        {/* Interactive Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full hover:bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant transition-all hover:scale-105 relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              notifications
            </span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-outline-variant z-50 overflow-hidden divide-y divide-outline-variant/30">
              <div className="p-3 bg-primary text-white flex justify-between items-center">
                <span className="text-xs font-semibold">Pemberitahuan</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                  {notifications.length} Info
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-outline">
                    Tidak ada pemberitahuan baru
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-surface-container/30 transition-colors flex gap-2.5 items-start"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.type === "urgent" ? "bg-error" : "bg-primary"}`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-on-surface line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-outline mt-0.5 leading-tight">
                          {item.description}
                        </p>
                        <span className="text-[9px] text-outline/50 mt-1 block">
                          {item.time}
                        </span>
                      </div>
                      {onClearNotification && (
                        <button
                          onClick={() => onClearNotification(item.id)}
                          className="text-outline/50 hover:text-error text-xs p-1"
                        >
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card Info with doctor username */}
        <div className="flex items-center gap-2 pl-2 rounded-full hover:bg-surface-container p-1 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container shadow-sm flex-shrink-0">
            <img
              src={userRole.avatarUrl}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="text-left hidden lg:block leading-none pr-2">
            <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
              {userRole.username}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
