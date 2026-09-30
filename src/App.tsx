import { Typography } from "@mui/material"
import { useTranslation } from "react-i18next"


function App() {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h1">
        {t("welcome")}
      </Typography>
    </>
  )
}

export default App
