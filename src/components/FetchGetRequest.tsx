import React, { useState, useEffect, useReducer } from "react";
import Table from "./Table";
import logo from "../logo.svg";
import styles from "./FetchGetRequest.module.css";
import { clsx } from "clsx";

const sourceUrl = `https://rrkarimov.amocrm.ru/api/v4/leads`;
const LIMIT = 3;
const ACCESS_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiNzUwNzI1MTY1MzBlYmZhN2I2YTM3NmUxMGQ5ZGNlOTVhMDNiMDg3ZWI4YmNjMzYwMGZjNzQzYjFlODMyYTY0MjM2YWQ1MWYxODU1NTViIn0.eyJhdWQiOiJiYzllZTVmMC1jMDRjLTQyODAtOGZkYS04MzA1YjhhYjM4NmYiLCJqdGkiOiIwYjc1MDcyNTE2NTMwZWJmYTdiNmEzNzZlMTBkOWRjZTk1YTAzYjA4N2ViOGJjYzM2MDBmYzc0M2IxZTgzMmE2NDIzNmFkNTFmMTg1NTU1YiIsImlhdCI6MTcyNzA4MDc5NCwibmJmIjoxNzI3MDgwNzk0LCJleHAiOjE3MzU2MDMyMDAsInN1YiI6IjExNTUyMzc0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTY1NTgyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMjA1ZTcxNGQtZjNjOC00MTcxLTg0YjYtYzI0YjY4NjNkYjM3IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.KqxoQY5TjHHtVvTuCLw2wmDT_szpwfHUj6AS0-TkVz2oEfh6Lu1PmT8axJsqMPYhXY5QAKTe3zZ536EB3yMZVjTSF9hAEX4C5rEKxwKhCFS7O2GepyediasXxoVXrCnpaOIwF-W7NpvCXqbzN1fZN2mr_baXV6CFkIMfjLEDtv5k_MnCSZ_UUfXNSkg1PwipxUbCdOBhgVuFTwk7JMkoVTTihiWo4jmEZaLes_GA8sbLoh2Q_zJocoli6sEYkP4EjEBwDcQrbL65epUEt94pW0pcteKrTkhfaj3azdQqdto6llaVNX8MqbH_4NdZ6XSC2YQaqNs-8Gwqt_5kzMdJLw";

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
    let dataAll: ILead[] = [];
    let link = `${sourceUrl}?limit=${LIMIT}`;
    const fetchDataForLeads = async (link: string) => {
      try {
        const response = await fetch(link, {
          headers: {
            Authorization: "Bearer " + ACCESS_TOKEN,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const data = await response.json();

        if (!data._embedded.leads) {
          throw new Error("No Data Available");
        }
        const leads = data._embedded.leads.map((raw: ILead) => {
          return {
            id: raw.id,
            name: raw.name,
            price: raw.price,
            closest_task_at: raw.closest_task_at,
          };
        });
        console.log(leads);
        dataAll = [...dataAll, ...leads];
        if (data._links.next) {
          link = data._links.next.href;
          setTimeout(
            () =>
              fetchDataForLeads(link)
                .then((leads) => setLeads(leads as ILead[]))
                .catch((err) => setError(err.message as string)),
            1000
          );
        } else {
          setLeadsLoading(false);
        }
        console.log(dataAll);

        return dataAll;
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }
      }
    };
    fetchDataForLeads(link)
      .then((data) => setLeads(data as ILead[]))
      .catch((err) => setError(err.message as string))
      .finally(() => setPageLoading(false));
  }, []);

  const closeClick = () => {
    dispatch({ type: "Close" });
  };

  const hadleClick = (id: ILead["id"]) => {
    dispatch({ type: "Loading" });

    const fetchDataForLead = async (id: string) => {
      try {
        const response = await fetch(sourceUrl + "/" + id, {
          headers: {
            Authorization: "Bearer " + ACCESS_TOKEN,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let data = await response.json();
        const lead = {
          id: data.id,
          name: data.name,
          price: data.price,
          closest_task_at: data.closest_task_at,
        };

        // console.log(lead);

        if (lead) {
          dispatch({ type: "Response", payload: lead as ILead });
        } else {
          dispatch({ type: "Close" });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message as string);
        }
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
