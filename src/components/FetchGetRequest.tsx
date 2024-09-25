import React, { useState, useEffect, useReducer } from "react";
import Table from "./Table";
import logo from "../logo.svg";
import styles from "./FetchGetRequest.module.css";
import { clsx } from "clsx";

const sourceUrl = `http://localhost:3333/search?`;
// const url = `https://rrkarimov.amocrm.ru/api/v4/leads`;
// const ACCESS_TOKEN =
// "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiNzUwNzI1MTY1MzBlYmZhN2I2YTM3NmUxMGQ5ZGNlOTVhMDNiMDg3ZWI4YmNjMzYwMGZjNzQzYjFlODMyYTY0MjM2YWQ1MWYxODU1NTViIn0.eyJhdWQiOiJiYzllZTVmMC1jMDRjLTQyODAtOGZkYS04MzA1YjhhYjM4NmYiLCJqdGkiOiIwYjc1MDcyNTE2NTMwZWJmYTdiNmEzNzZlMTBkOWRjZTk1YTAzYjA4N2ViOGJjYzM2MDBmYzc0M2IxZTgzMmE2NDIzNmFkNTFmMTg1NTU1YiIsImlhdCI6MTcyNzA4MDc5NCwibmJmIjoxNzI3MDgwNzk0LCJleHAiOjE3MzU2MDMyMDAsInN1YiI6IjExNTUyMzc0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTY1NTgyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMjA1ZTcxNGQtZjNjOC00MTcxLTg0YjYtYzI0YjY4NjNkYjM3IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.KqxoQY5TjHHtVvTuCLw2wmDT_szpwfHUj6AS0-TkVz2oEfh6Lu1PmT8axJsqMPYhXY5QAKTe3zZ536EB3yMZVjTSF9hAEX4C5rEKxwKhCFS7O2GepyediasXxoVXrCnpaOIwF-W7NpvCXqbzN1fZN2mr_baXV6CFkIMfjLEDtv5k_MnCSZ_UUfXNSkg1PwipxUbCdOBhgVuFTwk7JMkoVTTihiWo4jmEZaLes_GA8sbLoh2Q_zJocoli6sEYkP4EjEBwDcQrbL65epUEt94pW0pcteKrTkhfaj3azdQqdto6llaVNX8MqbH_4NdZ6XSC2YQaqNs-8Gwqt_5kzMdJLw";
export interface ILead {
  name: string;
  price: number;
  id: string;
  closest_task_at: number;
}
export interface IContext {
  handleClick: (id: ILead["id"]) => void;
  leads: ILead[];
  store: IState;
  closeClick: () => void;
}

interface IState {
  isLoading: boolean;
  isShow: boolean;
  data: ILead | null;
}

interface IAction {
  type: string;
  payload?: ILead;
}

const reducer = (state: IState, action: IAction): IState => {
  const { type } = action;
  switch (type) {
    case "Loading":
      console.log("loading");
      return { ...state, isLoading: true, isShow: true };
    case "Response":
      console.log("response", action.payload);
      return {
        ...state,
        isLoading: false,
        data: action.payload as ILead,
        isShow: true,
      };
    case "Close":
      console.log("close X");
      return { ...state, isLoading: false, isShow: false };
    default:
      return state;
  }
};

export const Context = React.createContext({} as IContext);

export default function FetchGetLeads() {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [pageloading, setPageLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [store, dispatch] = useReducer(reducer, {
    isLoading: false,
    isShow: false,
    data: null,
  } as IState);

  useEffect(() => {
    let page = 1;
    let dataAll: ILead[] = [];

    const fetchDataForLeads = async (page: number) => {
      try {
        const response = await fetch(sourceUrl + "page=" + page);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let data = await response.json();
        // console.log(page, data.length);

        if (data.length > 0) {
          setTimeout(
            () =>
              fetchDataForLeads(++page)
                .then((data) => setLeads(data as ILead[]))
                .catch((err) => setError(err.message as string)),
            1000
          );
          dataAll = [...dataAll, ...data];
        } else {
          setLeadsLoading(false);
        }

        return dataAll;
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }
      }
    };
    fetchDataForLeads(page)
      .then((data) => setLeads(data as ILead[]))
      .catch((err) => setError(err.message as string))
      .finally(() => setPageLoading(false));
    // }
  }, []);

  const closeClick = () => {
    dispatch({ type: "Close" });
  };

  const hadleClick = (id: ILead["id"]) => {
    // console.log(id);

    dispatch({ type: "Loading" });

    const fetchDataForLead = async (id: string) => {
      try {
        const response = await fetch(sourceUrl + "id=" + id);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let data = await response.json();
        if (data.length > 0) {
          dispatch({ type: "Response", payload: data[0] });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message as string);
        }
      } finally {
      }
    };

    fetchDataForLead(id);
  };

  if (error) {
    return (
      <div id="error-page">
        <h1>Oops! {error}</h1>
      </div>
    );
  } else if (pageloading) {
    return (
      <div>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    );
  } else if (leads?.length === 0 || !leads) {
    return (
      <div id="error-page">
        <h1>No Data Available</h1>
      </div>
    );
  } else
    return (
      <>
        <Context.Provider
          value={{
            handleClick: hadleClick,
            leads: leads,
            store: store,
            closeClick: closeClick,
          }}
        >
          <Table />
        </Context.Provider>
        <div className={clsx(leadsLoading ? styles.loading : styles.noLoading)}>
          Loading
        </div>
      </>
    );
}
