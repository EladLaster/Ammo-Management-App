import MyRequests from "../components/MyRequests";

export function RequestsPageUser() {
  // ניתן להחליף ל-userId אמיתי מה-store
  const userId = 1;
  return (
    <div>
      <h1>הבקשות שלי</h1>
      <MyRequests userId={userId} />
    </div>
  );
}
