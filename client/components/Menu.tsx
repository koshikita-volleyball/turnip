import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import pages from '../pages'
import { Button } from 'react-bootstrap'
import { BsGearFill } from 'react-icons/bs'
import setting from '../setting'

function Menu (): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    setCurrentPage(window.location.pathname)
  }, [])

  const PageChanged = (): void => {
    setCurrentPage(window.location.pathname)
  }

  return (
    <>
      <div id="Menu" className={menuOpen ? 'on' : ''}>
        {pages.map((page, index: number) => {
          return (
            <Link
              key={index}
              href={page.path}
              className={`btn ${
                currentPage === `${setting.basePath}${page.path}`
                  ? 'btn-primary active'
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
          className={`btn-close btn-close-white ${menuOpen ? 'on' : ''}`}
          onClick={() => {
            setMenuOpen(false)
          }}
        ></Button>
        <BsGearFill
          id="Opener"
          className={menuOpen ? 'off' : ''}
          onClick={() => {
            setMenuOpen(true)
          }}
        ></BsGearFill>
      </div>
    </>
  )
}

export default Menu
