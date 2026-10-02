import { Button } from '@mui/material'
import { nextLanguageLabel, switchLanguage } from '../../../language/config.ts'

export default function LanguageSwitch() {

    return (
        <Button
            variant="outlined"
            size="small"
            onClick={() => {
                void switchLanguage()
            }}
            sx={{
                position: 'fixed',
                top: 16,
                insetInlineEnd: 16,
                zIndex: (muiTheme) => muiTheme.zIndex.appBar,
            }}
        >
            {nextLanguageLabel()}
        </Button>
    )
}
