import React, { useState } from 'react'
import './App.css'
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

import QrScanner from './components/qr-reader'

function App() {
  const [state, setState] = useState(false)
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setState(open)
  }

  const handleScan = (data: any) => {
    if (data) {
      console.log(data);
      setState(false);
    }
  }

  return (
    <>
      <React.Fragment key={'bottom'}>
            <Button
            variant="contained"
            style={{ backgroundColor: 'black', color: 'white' }}
            onClick={toggleDrawer(true)}>
            <Icon
              baseClassName="material-symbols-rounded"
            >
              qr_code_scanner
            </Icon>
            </Button>
          <Drawer
            anchor={"bottom"}
            open={state}
            onClose={toggleDrawer(false)}
            className='qr-scanner'
          >
            <div className='drawer-qr-header'>
              <span></span>
              <h3>QR Code Reader</h3>
              <Button
                style={{ color: 'black' }}
                onClick={toggleDrawer(false)}
              >
                <Icon
                  fontSize='large'
                  baseClassName="material-symbols-rounded"
                >
                  close
                </Icon>
              </Button>
            </div>
            <QrScanner onScan={handleScan} />
          </Drawer>
        </React.Fragment>
    </>
  )
}

export default App
