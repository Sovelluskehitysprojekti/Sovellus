import React, { useEffect, useMemo, useState } from "react";
import { getGroupById, listAllGroups } from "../utils/categoryGroups";

const QuickSwitchModal = ({
  open,
  onClose,
  onApply,
  initialGroupId,
  initialSubcategoryId,
  initialDifficulty,
}) => {
  const groups = useMemo(() => listAllGroups(), []);
  const [groupId, setGroupId] = useState(initialGroupId || "any");
  const [difficulty, setDifficulty] = useState(initialDifficulty || "easy");
  const [subcategoryId, setSubcategoryId] = useState(
    initialSubcategoryId ? String(initialSubcategoryId) : ""
  );

  const currentGroup = useMemo(() => getGroupById(groupId), [groupId]);
  const hasSpecifics = !!(currentGroup?.specifics && currentGroup.specifics.length);

  // Reset subcategory when group changes
  useEffect(() => {
    setSubcategoryId("");
  }, [groupId]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Quick switch</h3>

        <div className="modal-row">
          <label>
            Topic
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>

          <label>
            Difficulty
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        {groupId !== "any" && hasSpecifics && (
          <div className="modal-row">
            <label>
              Specific (optional)
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
              >
                <option value="">— None —</option>
                {currentGroup.specifics.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
          <button
            className="primary-btn"
            onClick={() =>
              onApply({
                groupId,
                difficulty,
                subcategoryId: subcategoryId ? Number(subcategoryId) : null,
              })
            }
          >
            Apply & reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSwitchModal;
