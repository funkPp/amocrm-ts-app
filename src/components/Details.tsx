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
  const color = getColor(closetTaskAt) as Color;

  return (
    <>
      <div className={styles.containerDetails}>
        <div>Название: {store.data?.name}</div>
        <div>id: {store.data?.id}</div>
        <div>Дата: {dateFormatted}</div>
        <div>
          Статус:{" "}
          <span id="circle">
            <Svg color={color} size={20} />
          </span>
        </div>{" "}
        <br />
        <div className={styles.legend}>
          <div>
            <Svg color={"green"} size={15} /> - eсли задача будет в этот день,
            то зеленым.
          </div>
          <div>
            <Svg color={"red"} size={15} /> - если нет задачи или она
            просрочена(поставлена на вчера), то круг должен быть красным
          </div>
          <div>
            <Svg color={"yellow"} size={15} /> - если более чем через день, то
            желтым.
          </div>
        </div>
      </div>
    </>
  );
}

function getColor(date: Moment) {
  if (moment.utc().isAfter(date, "day")) return Color.red;
  if (moment.utc().isSame(date, "day")) return Color.green;
  if (moment.utc().add(1, "day").isBefore(date, "day")) return Color.yellow;
  return Color.background;
}
