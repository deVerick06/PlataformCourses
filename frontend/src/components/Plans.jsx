import { useNavigate } from "react-router-dom";

function Plans() {
    const currentPlan = localStorage.getItem("plan_type")

    const plans = [
        {
            name: 'Free',
            price: 'Grátis',
            benefit: ['Acesso a curos básicos', 'Suporte da comunidade'],
            db_value: 'free'
        },
        {
            name: 'Premium',
            price: '27,90/mês',
            benefit: ['Acesso a TODOS os cursos', 'Suporte prioritário', 'Certificados'],
            db_value: 'premium'
        }
    ]
}