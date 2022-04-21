import S from "./styles.module.scss";

export const Loader = () => {
  return (
    <div className={S.loaderContainer}>
      <div className={S.loader}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
