import React from 'react'
import Link from 'next/link'
import Layout from '../src/components/Layout';

const Index = () => (
    <Layout>
        <div>
            <ul>
                <li>
                    <Link href='/about' as='/o-projektu'><a>O projektu</a></Link>
                </li>
            </ul>
        </div>
    </Layout>
)

export default Index
