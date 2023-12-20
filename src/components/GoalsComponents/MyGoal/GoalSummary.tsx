import { GoalItem } from "@src/models/GoalItem";
import { calculateDaysLeft, formatBudgetHrsToText } from "@src/utils";
import React from "react";
import { useTranslation } from "react-i18next";

const SublistSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  console.log(goal.sublist);

  if (goal.sublist && goal.sublist.length > 0) {
    return (
      <span>
        {goal.sublist.length} {t("items")}
      </span>
    );
  }
  return <span>{t("noDuration")}</span>;
};

const GoalDurationSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  if (goal.timeBudget.perDay) {
    return null;
  }
  if (goal.duration) {
    return (
      <span>
        {goal.duration} {t(`hour${Number(goal.duration) > 1 ? "s" : ""}`)}
      </span>
    );
  }

  return <SublistSummary goal={goal} />;
};

const TimeBudgetComponent = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const { perDay, perWeek } = goal.timeBudget;

  if (!perDay && !perWeek) {
    return null;
  }

  const onWeekdays = goal.on.length === 5 && !goal.on.includes("Sat") && !goal.on.includes("Sun");
  const onWeekends = goal.on.length === 2 && goal.on.includes("Sat") && goal.on.includes("Sun");

  return (
    <div>
      <span>{formatBudgetHrsToText(perDay)}</span>
      <span>
        {goal.on.length > 0 && (
          <>
            {onWeekdays && ` ${t("on")} ${t("weekdays")}`}
            {onWeekends && ` ${t("on")} ${t("weekends")}`}
            {!onWeekdays && !onWeekends ? ` ${t("daily")}` : ` ${t("on")} ${goal.on.map((day) => t(day)).join(", ")}`}
          </>
        )}
      </span>
      <div>
        {goal.beforeTime && goal.afterTime
          ? `${t("between")} ${goal.afterTime}-${goal.beforeTime}`
          : goal.beforeTime
          ? `${t("before")} ${goal.beforeTime}`
          : goal.afterTime
          ? `${t("after")} ${goal.afterTime}`
          : ""}
      </div>

      <div>
        {formatBudgetHrsToText(perWeek)} {t("perWeek")}
      </div>
    </div>
  );
};

const DueDateComponent = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  if (!goal.due) {
    return null;
  }

  const dueDateText = calculateDaysLeft(goal.due);

  return (
    <div>
      <span>{dueDateText}</span>
    </div>
  );
};

const StartComponent = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const hasStarted = goal.start && new Date(goal.start).getTime() < new Date().getTime();
  const showStart = goal.due || !hasStarted;

  if (!showStart || !goal.start) {
    return null;
  }

  return (
    <div>
      {hasStarted ? t("started") : t("starts")} {new Date(goal.start).toDateString().slice(4)}
    </div>
  );
};

const HabitComponent = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  if (!goal.habit) {
    return null;
  }

  return <div>{goal.habit === "weekly" && <span>{t("everyWeek")}</span>}</div>;
};

const GoalSummary = ({ goal }: { goal: GoalItem }) => {
  const isBudget = goal.timeBudget.perDay !== null || goal.timeBudget.perWeek !== null;

  if (isBudget) {
    return (
      <>
        <TimeBudgetComponent goal={goal} />
        <StartComponent goal={goal} />
      </>
    );
  }
  return (
    <>
      <GoalDurationSummary goal={goal} />
      <DueDateComponent goal={goal} />
      <HabitComponent goal={goal} />
    </>
  );
};

export default GoalSummary;
