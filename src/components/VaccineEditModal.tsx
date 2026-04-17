import { useState, useEffect } from "react";
import type { Vaccine } from "../types";
import { useUpdateVaccine } from "../hooks/useVaccines";
import { getTodayString } from "../utils/date";

interface VaccineEditModalProps {
  vaccine: Vaccine;
  onClose: () => void;
}

export function VaccineEditModal({ vaccine, onClose }: VaccineEditModalProps) {
  const [done, setDone] = useState(vaccine.done);
  const [doneDate, setDoneDate] = useState(vaccine.done_date ?? "");
  const mutation = useUpdateVaccine();

  useEffect(() => {
    // When toggling done ON, default to today if no date set
    if (done && !doneDate) {
      setDoneDate(getTodayString());
    }
    // When toggling done OFF, clear date
    if (!done) {
      setDoneDate("");
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    mutation.mutate(
      {
        id: vaccine.id,
        payload: {
          done,
          done_date: done ? doneDate : null,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const canSave = !done || (done && doneDate.length > 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{vaccine.name}</h3>
          <span className="modal-name-en">{vaccine.name_en}</span>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label className="toggle-label">
              <span>{"\u5DF2\u5B8C\u6210"}</span>
              <div
                className={`toggle-switch${done ? " active" : ""}`}
                onClick={() => setDone((prev) => !prev)}
              >
                <div className="toggle-knob" />
              </div>
            </label>
          </div>

          <div className="modal-field">
            <label className="field-label">
              {"\u65BD\u6253\u65E5\u671F"}
            </label>
            <input
              type="date"
              className="date-input"
              value={doneDate}
              onChange={(e) => setDoneDate(e.target.value)}
              disabled={!done}
            />
          </div>

          {mutation.isError && (
            <div className="modal-error">
              {(mutation.error as Error)?.message ??
                "\u5132\u5B58\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            {"\u53D6\u6D88"}
          </button>
          <button
            className="modal-btn modal-btn-save"
            onClick={handleSave}
            disabled={!canSave || mutation.isPending}
          >
            {mutation.isPending
              ? "\u5132\u5B58\u4E2D..."
              : "\u5132\u5B58"}
          </button>
        </div>
      </div>
    </div>
  );
}
