import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-background border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aaryan Shrestha. All rights reserved.
        </p>
        </div>
    </footer>
  )
}

export default Footer