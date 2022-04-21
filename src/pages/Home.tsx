import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/api.js";
import { ItemProps } from "./Register.js";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import "../styles/home.scss";

export const Home = () => {
  const [itensArr, setItensArr] = useState<ItemProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchShoppItens() {
    try {
      setLoading(true);
      let { data: shoppItens, error } = await supabase
        .from("shopp_item")
        .select("id, isChecked, name, amount")
        .eq("isBuyNow", "true")
        .order("isChecked", { ascending: false });

      if (error) toast.error("Erro ao carregar a lista de compras.");

      if (shoppItens) setItensArr(shoppItens);
    } catch (e) {
      toast.error("Erro ao carregar, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const isSignIn = localStorage.getItem("login");

    if (!isSignIn) {
      window.location.href = "/";
    }

    fetchShoppItens();
  }, []);

  async function checkItem(item: ItemProps) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("shopp_item")
        .update({
          isChecked: !item.isChecked,
        })
        .eq("id", item.id)
        .single();

      if (error) toast.error(error.message);

      let currentItens = itensArr;
      let itemIndex = itensArr.findIndex((findItem) => findItem.id === item.id);
      currentItens[itemIndex].isChecked = !item.isChecked;
      setItensArr(currentItens);

      // Marcado todos os itens
      let checkedItens = itensArr.filter((item) => item.isChecked === true);
      if (checkedItens.length === itensArr.length) setShowModal(true);
    } catch (e) {
      toast.error("Erro ao Marcar um item, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function clearList() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("shopp_item")
        .update({
          isBuyNow: false,
          isChecked: false,
        })
        .eq("isBuyNow", "true")
        .eq("isChecked", "true");

      if (error) toast.error(error.message);

      setItensArr([]);
      toast.success("Lista limpa com Sucesso!");
    } catch (e) {
      toast.error("Erro ao Limpar a Lista, tente novamente mais tarde.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  }

  function handleOutsideClick(e: any) {
    if (e.target.id === "modal") setShowModal(false);
  }

  return (
    <>
      {loading && <Loader />}

      <main className="home">
        <h1>Lista de Compras</h1>

        {/* <div className="categories">
        <h2>Categorias</h2>
        <ul>
          <li>
            <p>Higiene pessoal</p>
            <span>07</span>
          </li>
          <li>
            <p>Produtos de limpeza</p>
            <span>12</span>
          </li>
          <li>
            <p>hortaliças</p>
            <span>05</span>
          </li>
        </ul>
      </div> */}

        <div className="shopplist">
          <h2>Compras de Hoje</h2>
          <ul>
            {itensArr.map((item) => (
              <li
                onClick={() => checkItem(item)}
                className={item.isChecked ? "checked" : ""}
                key={item.id}
              >
                <div className="checkboxContainer">
                  <div className="checkbox"></div>
                  <h3>{item.name}</h3>
                </div>
                <span>{item.amount}</span>
              </li>
            ))}
            {itensArr.length <= 0 && (
              <li className="noItensInList">Nenhum item na lista...</li>
            )}
          </ul>
        </div>
      </main>

      {showModal && (
        <div className="modal" id="modal" onClick={handleOutsideClick}>
          <div className="modalWrapper animeUp">
            <h3>Deseja Limpar a Lista?</h3>
            <p>Todos os Itens foram Comprados!</p>

            <div className="btns">
              <button onClick={clearList}>Sim</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
