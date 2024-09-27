import { useContext } from "react";
import { Context } from "./FetchGetRequest";
import styles from "./Details.module.css";
import Svg from "./Svg";
import moment, { Moment } from "moment";

enum Color {
  background = "#2c3e50",
  red = "red",
  green = "green",
  yellow = "yellow",
}
export default function Details() {
  const { store } = useContext(Context);

  let closest_task_at = store.data?.closest_task_at;
  const closetTaskAt = closest_task_at
    ? moment.utc(closest_task_at * 1000)
    : moment(0);

  const dateFormatted = closetTaskAt.format("DD.MM.YYYY");
  const [color, tooltiptext] = getStatus(closetTaskAt);

  return (
    <div className={styles.containerDetails}>
      <div>Название: {store.data?.name}</div>
      <div>id: {store.data?.id}</div>
      <div>Дата: {dateFormatted}</div>
      <div>
        Статус:{" "}
        <span>
          <Svg color={color} size={20} />
          <span className={styles.tooltiptext}>{tooltiptext}</span>
        </span>
      </div>
    </div>
  );
}

function getStatus(date: Moment) {
  if (moment.utc().isAfter(date, "day"))
    return [Color.red, " - задачи нет или просрочена"];
  if (moment.utc().isSame(date, "day"))
    return [Color.green, " - задача в этот день"];
  if (moment.utc().add(1, "day").isBefore(date, "day"))
    return [Color.yellow, " - поставлена на через день или далее"];
  return [Color.background, ""];
}
