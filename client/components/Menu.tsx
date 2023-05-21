import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import pages from '../pages'
import { Button } from 'react-bootstrap'
import { BsGearFill } from 'react-icons/bs'
import setting from '../setting'

function Menu () {
  const [current_page, setCurrentPage] = useState<string | null>(null)
  const [menu_open, setMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    setCurrentPage(window.location.pathname)
  }, [])

  const PageChanged = () => {
    setCurrentPage(window.location.pathname)
  }

  return (
    <>
      <div id="Menu" className={menu_open ? 'on' : ''}>
        {pages.map((page, index: number) => {
          return (
            <Link
              key={index}
              href={page.path}
              className={`btn ${
                current_page === `${setting.basePath}${page.path}`
                  ? 'btn-primary'
                  : ''
              }`}
              onClick={PageChanged}
            >
              {page.emoji}&nbsp;{page.name}
            </Link>
          )
        })}
      </div>
      <div id="ToMenu">
        <Button
          id="Closer"
          variant="primary"
          className={`btn-close btn-close-white ${menu_open ? 'on' : ''}`}
          onClick={() => {
            setMenuOpen(false)
          }}
        ></Button>
        <BsGearFill
          id="Opener"
          className={menu_open ? 'off' : ''}
          onClick={() => {
            setMenuOpen(true)
          }}
        ></BsGearFill>
      </div>
    </>
  )
}

export default Menu
