import { useNavigate } from "react-router-dom";

function Plans() {
    const currentPlan = localStorage.getItem("plan_type")
    const navigate = useNavigate();

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

    async function handleUpgrade(plan_value) {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:5000/users/upgrade_plan", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({plan_value: plan_value})
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return
        }

        if (response.ok) {
            localStorage.setItem("plan_type", plan_value);
            navigate("/home");
            return
        }
        console.log(currentPlan)
    }

    return (
        <>
            <h2>Planos:</h2>
            {plans.map((plan) => (
                <div key={plan.db_value} style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <h3>{plan.name}</h3>
                    <span>
                        {plan.price}
                    </span>
                    {plan.benefit.map((benefit_plan, index) => (
                        <p key={index}>{benefit_plan}</p>
                    ))}
                    {currentPlan != plan.db_value ? (
                        <button style={{ padding: '5px', borderRadius: '5px', backgroundColor: 'blue', color: 'white', fontFamily: 'Arial, Helvetica, sans-serif' }} onClick={() => handleUpgrade(plan.db_value)} >Assinar</button>
                    ) : (
                        <button disabled>Assinado</button>
                    )}
                </div>
            ))}
        </>
    )
}

export default Plans