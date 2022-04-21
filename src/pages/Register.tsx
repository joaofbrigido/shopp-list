import { FormEvent, useEffect, useMemo, useState } from "react";
import checkIcon from "../imgs/iconPutOnList.svg";
import editIcon from "../imgs/editTable.svg";
import deleteIcon from "../imgs/deleteTable.svg";
import backIcon from "../imgs/setaVoltar.svg";
import { useVisibleContent } from "../hooks/useVisibleContent";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import { supabase } from "../supabase/api.js";
import "../styles/register.scss";

export type ItemProps = {
  id: number;
  name: string;
  amount: number;
  isBuyNow: boolean;
  isChecked: boolean;
};

export const Register = () => {
  const {
    homeVisible,
    editVisible,
    registerVisible,
    showEdit,
    showHome,
    showRegister,
  } = useVisibleContent();

  const [loading, setLoading] = useState(false);
  const [itensArr, setItensArr] = useState<ItemProps[]>([]);
  const [itemEdit, setItemEdit] = useState<ItemProps | null>(null);
  const [itemDeleteId, setItemDeleteId] = useState<Number | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function fetchItens() {
    try {
      setLoading(true);
      let { data: shoppItem, error } = await supabase
        .from("shopp_item")
        .select("id, name, amount, isBuyNow")
        .order("isBuyNow", { ascending: false })
        .order("id", { ascending: false });

      if (error) setError(error.message);

      if (shoppItem) setItensArr(shoppItem);
    } catch (e) {
      toast.error("Erro ao carregar itens cadastrados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const isSignIn = localStorage.getItem("login");

    if (!isSignIn) {
      window.location.href = "/";
    }

    fetchItens();
  }, []);

  async function submitExpense(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (itemEdit) {
        updateItem();
      } else {
        if (name !== "" && amount !== 0) {
          const { data, error } = await supabase
            .from("shopp_item")
            .insert({
              name: name,
              amount: amount,
              isBuyNow: false,
            })
            .single();

          if (error) setError(error.message);

          setItensArr([...itensArr, data]); // atualiza array
          toast.success("Item inserido com Sucesso!");
          setName("");
          setAmount(0);
          // location.reload();
        } else {
          toast.error("Necessário preencher o Item e Quantidade.");
        }
      }
    } catch (e) {
      toast.error("Erro ao inserir ou atualizar item!");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(itemUp: ItemProps) {
    showEdit();
    setItemEdit(itemUp);
    setItemDeleteId(itemUp.id);
    setName(itemUp.name);
    setAmount(itemUp.amount);
  }

  function handleRegisterItem() {
    setName("");
    setAmount(0);
    setItemEdit(null);
    showRegister();
  }

  function handleDelete(itemId: number) {
    setItemDeleteId(itemId);
    setShowModal(true);
  }

  async function updateItem() {
    if (itemEdit) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from("shopp_item")
          .update({
            name: name,
            amount: amount,
          })
          .eq("id", itemEdit.id)
          .single();

        if (error) setError(error.message);

        let currentItens = itensArr;
        let itemIndex = itensArr.findIndex((item) => item.id === itemEdit.id);
        currentItens[itemIndex].name = name;
        currentItens[itemIndex].amount = Number(amount);

        toast.success("Item Atualizado!");
        setItensArr(currentItens);
        setItemEdit(null);
        setItemDeleteId(null);
        showHome();
      } catch (e) {
        toast.error("Erro ao atualizar um Item! Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
  }

  async function deleteItem() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("shopp_item")
        .delete()
        .eq("id", itemDeleteId);

      if (error) setError(error.message);

      let deletedItem = itensArr.filter((item) => item.id !== itemDeleteId);
      setItensArr(deletedItem);

      setShowModal(false);
      setItemDeleteId(null);
      toast.success("Item Excluído com Sucesso!");
      showHome();
    } catch (e) {
      toast.error("Erro ao excluir um Item!");
    } finally {
      setLoading(false);
    }
  }

  async function isBuyNow(item: ItemProps) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("shopp_item")
        .update({
          isBuyNow: !item.isBuyNow,
          isChecked: false,
        })
        .eq("id", item.id)
        .single();

      if (error) setError(error.message);

      let currentItens = itensArr;
      let itemIndex = itensArr.findIndex((findItem) => findItem.id === item.id);
      currentItens[itemIndex].isBuyNow = !item.isBuyNow;
      setItensArr(currentItens);
    } catch (e) {
      toast.error("Erro ao atualizar um Item! Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  const itensFiltered = useMemo(() => {
    const lowerSearch = search.toLocaleLowerCase();
    return itensArr.filter((item) =>
      item.name.toLocaleLowerCase().includes(lowerSearch)
    );
  }, [itensArr, search]);

  function handleOutsideClick(e: any) {
    if (e.target.id === "modal") setShowModal(false);
  }

  return (
    <>
      {loading && <Loader />}
      {error && (
        <p
          style={{
            textAlign: "center",
            padding: "0 0.6rem",
            marginTop: "2.5rem",
            color: "crimson",
          }}
        >
          {error}
        </p>
      )}

      {homeVisible ? (
        <main className="register">
          <h1>Itens Cadastrados</h1>

          <div className="filtersWrap">
            <input
              type="text"
              placeholder="Buscar Item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {itensFiltered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.name} ({item.amount})
                    </td>
                    <td>
                      <button onClick={() => isBuyNow(item)}>
                        <img
                          src={checkIcon}
                          alt="Inserir item na lista de Compras"
                          className={item.isBuyNow ? "active" : ""}
                        />
                      </button>
                      <button onClick={() => handleEdit(item)}>
                        <img src={editIcon} alt="editar item" />
                      </button>
                      <button onClick={() => handleDelete(item.id)}>
                        <img src={deleteIcon} alt="deletar item" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btnRegisterItem" onClick={handleRegisterItem}>
            Cadastrar Item
          </button>
        </main>
      ) : registerVisible || editVisible ? (
        <main className="registerItem">
          <div className="titleWrap">
            <button onClick={showHome}>
              <img src={backIcon} alt="Voltar Listagem Itens" />
            </button>
            <h1>Cadastrar Item</h1>
          </div>

          <div className="inputWrap">
            <label htmlFor="item">Nome do Item</label>
            <input
              type="text"
              placeholder="Insira o nome do Item"
              id="item"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="inputWrap">
            <label htmlFor="item">Quantidade</label>
            <input
              type="number"
              placeholder="Insira a qtd do Item"
              id="item"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="btnWrap">
            <button className="btnRegister" onClick={submitExpense}>
              {editVisible ? "SALVAR" : "CADASTRAR"}
            </button>
            {editVisible && (
              <button className="btnDelete" onClick={() => setShowModal(true)}>
                EXCLUIR
              </button>
            )}
          </div>
        </main>
      ) : null}

      {showModal && (
        <div className="modal" id="modal" onClick={handleOutsideClick}>
          <div className="modalWrapper animeUp">
            <h3>Deseja Excluir um Item?</h3>
            <p>Após excluido não é possível restaurá-lo</p>

            <div className="btns">
              <button onClick={deleteItem}>Confirmar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
