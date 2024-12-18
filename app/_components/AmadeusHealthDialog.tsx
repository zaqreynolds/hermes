import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const AmadeusHealthDialog = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogContent uncloseable>
        <DialogTitle>Hermes Temporarily Unavailable</DialogTitle>
        <DialogDescription>
          The API, which powers flight search results, is temporarily down for
          maintenance. We apologize for the inconvenience and appreciate your
          patience. Please try again shortly.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default AmadeusHealthDialog;
