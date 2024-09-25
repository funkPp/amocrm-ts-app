import { useContext } from "react";
import { Context } from "./FetchGetRequest";
import styles from "./Details.module.css";
// import { clsx } from "clsx";
// import circle from "../circle.svg";
import Svg from "./Svg";

enum Color {
  black = "black",
  red = "red",
  green = "green",
  yellow = "yellow",
}
//newBranch
export default function Details() {
  const { store } = useContext(Context);
  const date = store.data?.closest_task_at;
  const dateFormatted = formatDate(date as number);

  const nowNumber = new Date().setHours(0, 0, 0, 0);
  const dateNumber = new Date(date as number).setHours(0, 0, 0, 0);
  let color;

  if (dateNumber - nowNumber < 0) color = Color.red;
  else if (dateNumber === nowNumber) color = Color.green;
  else if (dateNumber - nowNumber > 24 * 3600 * 1000) color = Color.yellow;
  else color = Color.black;

  console.log(nowNumber, dateNumber, color);

  return (
    <>
      <div className={styles.containerDetails}>
        <div>Название: {store.data?.name}</div>
        <div>id: {store.data?.id}</div>
        <div>Дата: {dateFormatted}</div>
        <div>
          Статус:{" "}
          <span id="circle">
            <Svg color={color} size={25} />
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
          <div>
            <Svg color={"black"} size={15} /> - остальные случаи (в ТЗ такого не
            было)
          </div>
        </div>
      </div>
    </>
  );
}

const formatDate = (date: number) => {
  if (typeof date !== "number") return;
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join(".");
};
