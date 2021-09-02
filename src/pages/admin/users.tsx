import Head from 'next/head'
import api from '../../helpers/api'
import { GetServerSideProps } from 'next'
import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ExtendedUser } from '../../types'

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  try {
    const res = await api.get('admin/users', {
      headers: context?.req?.headers?.cookie ? { cookie: context.req.headers.cookie } : undefined,
    })

    if (res.data.error) {
      return { redirect: { destination: '/', permanent: false } }
    }

    const users = res.data.users;
    // Pass data to the page via props
    return { props: { users } }
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } }
  }
}

export default function Categories(props: any) {
  const users = props.users

  const totalDinerosBodyTemplate = (rowData: ExtendedUser) => {
    return rowData.totalDineros + '€';
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mb-3">
        <h1>Users</h1>

        <div className="card">
          <DataTable value={users} paginator rows={15} header="Responsive">
            <Column field="name" header="Name" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="totalOrders" header="Total orders" sortable></Column>
            <Column field="totalItems" header="Total items bought" sortable></Column>
            <Column field="totalDineros" header="Total money spent" body={totalDinerosBodyTemplate} sortable></Column>
          </DataTable>
        </div>
      </main>
    </div>
  )
}