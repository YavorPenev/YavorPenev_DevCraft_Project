import React from 'react'
import { NavLink } from 'react-router'
import Header from '../components/header'
import { useSelector } from 'react-redux'

const LearnMore = () => {
    const { user } = useSelector((state) => state.auth)

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-800 text-white px-4 py-12 md:px-8">
                <div className="max-w-5xl mx-auto">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="md:w-2/3">
                            <h1 className="text-4xl font-bold text-cyan-400 mb-4">DevCraft</h1>
                            <p className="text-gray-300 text-lg">
                                DevCraft е платформа, създадена основно за млади програмисти, които работят по лични или групови проекти.
                                Платформата е полезена при хакатони, лични проекти и работа в екип.
                            </p>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <img src="../../../public/logo1.svg" alt="DevCraft Logo" className="max-w-full h-auto max-h-48" />
                        </div>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8">
                        <p className="text-gray-300 whitespace-pre-wrap break-words">
                            Предоставя различки функционалности, които улесняват работата на програмиста. Освен това има отлична система за верификация, която увеличава сигурността на потребителите и предоставя възможност за сменяне на парола при нужда.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Управление на проекти</h2>
                        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                            <p className="text-gray-300 mb-4">
                                DevCraft предлага управление на проекти с CRUD функционалности.
                            </p>
                            <ul className="list-disc pl-6 text-gray-300 space-y-2">
                                <li>Собственикът на проект може да добавя други участници към проекта</li>
                                <li>Всеки участник има достъп до to-dos, бележките и основната информация на проекта</li>
                                <li>Всички участници могат да извършват CRUD операции върху горепосочените функционалности (с изключение на основната информация, която редактира само собственикът)</li>
                                <li>Всеки групов проект разполага и с групов чат за улеснена комуникация</li>
                            </ul>
                        </div>
                    </div>


                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Лични функционалности</h2>
                    <p className="text-gray-300 mb-6">
                        Разбира се, освен проектите, DevCraft предлага и други лични функционалности:
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">Полезни източници</h3>
                            <p className="text-gray-300 mb-4">Страница UsefulSources за запазване на полезна информация под формата на текст, документи, линкове и снимки.</p>
                            <NavLink to={user ? "/useful-sources" : "/login"} className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                                Разгледай
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </NavLink>
                        </div>

                        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">Идеи за проекти</h3>
                            <p className="text-gray-300 mb-4">Ако на потребителя му хрумне идея за проект, но в момента не може да я осъществи може да си я запише в страницата Ideas и по късно да я започне, без риск да я забрави.</p>
                            <NavLink to={user ? "/ideas" : "/login"} className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                                Разгледай
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </NavLink>
                        </div>

                        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">Библиотека с код</h3>
                            <p className="text-gray-300 mb-4">Последната функционалност позволява да се запазват части код в библиотеки, разделени по езици, което увеличава ефикасноста на работа.</p>
                            <NavLink to={user ? "/code-fragments" : "/login"} className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                                Разгледай
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </NavLink>
                        </div>
                    </div>


                    <div className="bg-gray-700 p-8 rounded-lg border border-gray-600 text-center">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Готов ли си да подобриш твоя работен процес?</h2>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Създай своите първи проекти, използвай DevCraft за организиране на своята работа и повишаване на продуктивността си.
                        </p>
                        {!user ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <NavLink
                                    to="/signup"
                                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-block"
                                >
                                    Създай акаунт
                                </NavLink>
                                <NavLink
                                    to="/login"
                                    className="bg-gray-600 hover:bg-gray-500 border border-cyan-400 text-cyan-400 font-bold px-6 py-3 rounded-lg transition-colors inline-block"
                                >
                                    Влез в акаунта си
                                </NavLink>
                            </div>
                        ) : (
                            <NavLink
                                to="/projects"
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-block"
                            >
                                Към проектите
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LearnMore
