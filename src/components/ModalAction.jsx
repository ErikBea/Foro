function ModalAction({ title, message, onConfirm })
{
    //Modal que ejecuta una accion si se pulsa en confirmar
    return(
        <div className="modal fade" id="deleteConfirmation">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body">
                        <p>{message}</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAction;