import React, { useState, useEffect, useReducer } from "react";
import Table from "./Table";
import styles from "./FetchGetRequest.module.css";
import { clsx } from "clsx";
import { ILead, IContext, IState } from "../types";
import { reducer } from "../reducer";

const sourceUrl = process.env.REACT_APP_BASE_URL;
const LIMIT = process.env.REACT_APP_LIMIT;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

export const Context = React.createContext({} as IContext);

export default function FetchGetLeads() {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [store, dispatch] = useReducer(reducer, {
    isLoading: false,
    isShow: false,
    data: null,
  } as IState);
  console.log(sourceUrl, ACCESS_TOKEN, LIMIT);

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
      .catch((err) => setError(err.message as string));
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
    return <h1> Oops! {error} </h1>;
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
        <div className={clsx(leadsLoading ? styles.loading : styles.pending)}>
          Loading
        </div>
      </>
    );
}
