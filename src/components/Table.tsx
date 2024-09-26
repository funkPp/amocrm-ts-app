import { useContext } from "react";
import { Context } from "./FetchGetRequest";
import style from "./Table.module.css";
import spiner from "../logo.svg";
import Details from "./Details";

export default function Table() {
  const { handleClick, leads, store, closeClick } = useContext(Context);

  const renderTable = leads.map((lead) => (
    <tr key={lead.id} className={style.tr} onClick={() => handleClick(lead.id)}>
      <td>{lead.id}</td>
      <td>{lead.name}</td>
      <td>{lead.price}</td>
    </tr>
  ));
  return (
    <>
      <table className={style.table}>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{renderTable}</tbody>
      </table>
      {store.isShow && (
        <div className={style.container}>
          <div className={style.closeBox} onClick={closeClick}>
            X
          </div>
          {store.isLoading ? (
            <div className={style.containerSpiner}>
              <img src={spiner} className="App-spiner" alt="spiner" />
            </div>
          ) : (
            <Details />
          )}
        </div>
      )}
    </>
  );
}
